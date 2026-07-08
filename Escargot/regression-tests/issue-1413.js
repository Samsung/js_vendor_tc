// issue #1413: heap-buffer-overflow in Interpreter::interpret (via ExecutionPauser::start)
//
// An async generator that does `let v0 = yield; eval(a1); return v0;`, called
// with two back-to-back .next() calls, used to crash with a heap-buffer-overflow.
//
// Root cause: ExecutionPauser::pause() marks the current ExecutionState chain
// as "stopped" (m_inExecutionStopState) so the nested C++ call stack
// (InterpreterSlowPath::blockOperation, one frame per enclosing lexical
// block/try) unwinds correctly once pause() returns. While still inside that
// same pause() call, it calls AsyncGeneratorObject::asyncGeneratorResolve(),
// which -- per spec, when another next() request is already queued --
// synchronously and reentrantly drives the SAME generator through a full
// resume-to-completion cycle via a nested ExecutionPauser::start() call on the
// same ExecutionPauser object, before the outer pause() call has returned.
// That nested resume's own bookkeeping clears m_inExecutionStopState on the
// (aliased) execution state chain the outer, still-unwinding pause() call
// owns. The outer blockOperation() frame then reads a stale "not stopped"
// flag and wrongly falls through to the position right after the function's
// outermost lexical block -- which, since the function ends with `return`,
// sits exactly at the end of the (already fully generated) bytecode buffer,
// producing an out-of-bounds read.
//
// Fixed by re-marking the outer chain as stopped immediately after the
// (possibly reentrant) asyncGeneratorResolve() call returns.

function expectNoCrash(desc) {
    print("PASS: " + desc);
}

// original report (reduced)
(function () {
    function main() {
        async function* f0(a1) {
            let v0 = yield;
            eval(a1);
            return v0;
        }
        let v1 = f0(1);
        v1.next();
        v1.next();
    }
    main();
    expectNoCrash("original report: eval(non-string) in async generator body, back-to-back next()");
})();

// same shape, but verify the actual resumed values/results are correct
// (not just "doesn't crash") once the pending promises settle.
(function () {
    async function* f1(a1) {
        let v0 = yield 42;
        eval(a1);
        return v0 + 1;
    }
    let it = f1(1);
    let results = [];
    let done = false;

    it.next().then(r => results.push(r));
    it.next(100).then(r => results.push(r));
    it.next().then(r => {
        results.push(r);
        done = true;
    });

    // the shell drains the microtask/job queue after the script body finishes,
    // so this check runs as a separate "verify" pass appended to the queue.
    Promise.resolve().then(() => Promise.resolve()).then(() => Promise.resolve()).then(() => {
        if (!done || results.length !== 3) {
            throw new Error("FAIL: expected 3 settled results, got " + JSON.stringify(results));
        }
        if (results[0].value !== 42 || results[0].done !== false) {
            throw new Error("FAIL: first next() result wrong: " + JSON.stringify(results[0]));
        }
        if (results[1].value !== 101 || results[1].done !== true) {
            throw new Error("FAIL: second (queued) next(100) result wrong: " + JSON.stringify(results[1]));
        }
        if (results[2].value !== undefined || results[2].done !== true) {
            throw new Error("FAIL: third next() (after completion) result wrong: " + JSON.stringify(results[2]));
        }
        print("PASS: queued next() while yield is settling resumes with correct values");
    });
})();

// multiple yields, no eval, sequential awaited next() calls: must still work normally.
(function () {
    async function* g() {
        yield 1;
        yield 2;
        return 3;
    }
    async function driver() {
        const it = g();
        const r1 = await it.next();
        const r2 = await it.next();
        const r3 = await it.next();
        const r4 = await it.next();
        if (r1.value !== 1 || r1.done !== false) throw new Error("FAIL: r1 " + JSON.stringify(r1));
        if (r2.value !== 2 || r2.done !== false) throw new Error("FAIL: r2 " + JSON.stringify(r2));
        if (r3.value !== 3 || r3.done !== true) throw new Error("FAIL: r3 " + JSON.stringify(r3));
        if (r4.value !== undefined || r4.done !== true) throw new Error("FAIL: r4 " + JSON.stringify(r4));
        print("PASS: sequential awaited next() calls on a plain async generator");
    }
    driver();
})();
