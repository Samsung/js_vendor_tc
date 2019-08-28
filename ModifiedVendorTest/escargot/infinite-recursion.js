
function foo()
{
  foo()
}


try {
  foo()
} catch (e)
{
  assertEq(e.name, "RangeError")
}
