actor {
  // Simple hello world logic for now to ensure backend works
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
}
