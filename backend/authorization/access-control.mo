import HashMap "mo:base/HashMap";
import P "mo:base/Principal";
import Hash "mo:base/Hash";
import Debug "mo:base/Debug";

module {
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : HashMap.HashMap<P.Principal, UserRole>;
  };

  // Manual hash function to convert Principal to Hash.Hash (usually Nat32)
  func principalHash(p : P.Principal) : Hash.Hash {
    P.hash(p);
  };

  public func initState() : AccessControlState {
    {
      var adminAssigned = false;
      userRoles = HashMap.HashMap<P.Principal, UserRole>(10, P.equal, principalHash);
    };
  };

  public func initialize(state : AccessControlState, caller : P.Principal, adminToken : Text, userProvidedToken : Text) {
    if (P.isAnonymous(caller)) { return };
    if (state.userRoles.get(caller) != null) { return };

    if (not state.adminAssigned and userProvidedToken == adminToken) {
      state.userRoles.put(caller, #admin);
      state.adminAssigned := true;
    } else {
      state.userRoles.put(caller, #user);
    };
  };

  public func getUserRole(state : AccessControlState, caller : P.Principal) : UserRole {
    if (P.isAnonymous(caller)) { return #guest };
    switch (state.userRoles.get(caller)) {
      case (?role) { role };
      case (null) {
        Debug.trap("User is not registered");
      };
    };
  };

  public func assignRole(state : AccessControlState, caller : P.Principal, user : P.Principal, role : UserRole) {
    if (not (isAdmin(state, caller))) {
      Debug.trap("Unauthorized: Only admins can assign user roles");
    };
    state.userRoles.put(user, role);
  };

  public func hasPermission(state : AccessControlState, caller : P.Principal, requiredRole : UserRole) : Bool {
    let userRole = getUserRole(state, caller);
    if (userRole == #admin or requiredRole == #guest) { true } else { userRole == requiredRole };
  };

  public func isAdmin(state : AccessControlState, caller : P.Principal) : Bool {
    getUserRole(state, caller) == #admin;
  };
};
