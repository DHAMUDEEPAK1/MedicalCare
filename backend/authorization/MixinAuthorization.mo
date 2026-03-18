import AccessControl "./access-control";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

module {
  // We use a constant for the admin token in local dev.
  // In production, this should be handled via a secure initialization process.
  let DEV_ADMIN_TOKEN = "your_secret_admin_token_here";

  public func _initializeAccessControlWithSecret(accessControlState : AccessControl.AccessControlState, caller : Principal, userSecret : Text) : async () {
    AccessControl.initialize(accessControlState, caller, DEV_ADMIN_TOKEN, userSecret);
  };

  public func getCallerUserRole(accessControlState : AccessControl.AccessControlState, caller : Principal) : AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public func assignCallerUserRole(accessControlState : AccessControl.AccessControlState, caller : Principal, user : Principal, role : AccessControl.UserRole) {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public func isCallerAdmin(accessControlState : AccessControl.AccessControlState, caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
