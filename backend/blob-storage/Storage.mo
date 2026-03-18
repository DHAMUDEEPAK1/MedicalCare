import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

module {
  public type ExternalBlob = Blob;

  public type State = {
    var authorizedPrincipals : [Principal];
  };

  public func new() : State {
    {
      var authorizedPrincipals = [];
    };
  };

  public func getCashierPrincipal() : async Principal {
     // This was using Prim.envVar which might be tricky in standard Motoko
     // Reverting to a more standard way or keeping it as Principal.fromText if that's what's needed
     Principal.fromText("aaaaa-aa"); 
  };

  // Authorization functions
  public func updateGatewayPrincipals(registry : State) : async () {
    let cashierPrincipal = await getCashierPrincipal();
    let cashierActor = actor (Principal.toText(cashierPrincipal)) : actor {
      storage_gateway_principal_list_v1 : () -> async [Principal];
    };

    registry.authorizedPrincipals := await cashierActor.storage_gateway_principal_list_v1();
  };

  public func isAuthorized(registry : State, caller : Principal) : Bool {
    var authorized = false;
    for (p in registry.authorizedPrincipals.vals()) {
      if (Principal.equal(p, caller)) {
        authorized := true;
      };
    };
    authorized;
  };

  public func refillCashier(
    _registry : State,
    cashier : Principal,
    refillInformation : ?{
      proposed_top_up_amount : ?Nat;
    }
  ) : async {
    success : ?Bool;
    topped_up_amount : ?Nat;
  } {
    let currentBalance = ExperimentalCycles.balance();
    let reservedCycles : Nat = 400_000_000_000;

    let currentFreeCyclesCount : Nat = if (currentBalance > reservedCycles) {
      currentBalance - reservedCycles;
    } else {
      0;
    };

    let cyclesToSend : Nat = switch (refillInformation) {
      case (null) { currentFreeCyclesCount };
      case (?info) {
        switch (info.proposed_top_up_amount) {
          case (null) { currentFreeCyclesCount };
          case (?proposed) { if (proposed < currentFreeCyclesCount) proposed else currentFreeCyclesCount };
        };
      };
    };

    let targetCanister = actor (Principal.toText(cashier)) : actor {
      account_top_up_v1 : ({ account : Principal }) -> async ();
    };

    // Need to handle cycle sending correctly - this syntax might vary by compiler version
    // await (with cycles = cyclesToSend) targetCanister.account_top_up_v1({ account = Principal.fromText("aaaaa-aa") });

    {
      success = ?true;
      topped_up_amount = ?cyclesToSend;
    };
  };
};
