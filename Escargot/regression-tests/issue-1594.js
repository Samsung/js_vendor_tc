function trigger() {
  var x;
  x = class {
    [x = 42] = 1;
  };
}
trigger();
