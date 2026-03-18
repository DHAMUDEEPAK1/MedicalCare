import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Storage "Storage";

module {
  public type _medicalcareStorageRefillInformation = {
    proposed_top_up_amount : ?Nat;
  };

  public type _medicalcareStorageRefillResult = {
    success : ?Bool;
    topped_up_amount : ?Nat;
  };

  public type _medicalcareStorageCreateCertificateResult = {
    method : Text;
    blob_hash : Text;
  };

  public func initState() : Storage.State {
    Storage.new();
  };

  public func refillCashier(state : Storage.State, caller : Principal, refillInformation : ?_medicalcareStorageRefillInformation) : async _medicalcareStorageRefillResult {
    let cashier = await Storage.getCashierPrincipal();
    /*
    let _targetCanister = actor (Principal.toText(cashier)) : actor {
      account_top_up_v1 : ({ account : Principal }) -> async ();
    };
    */
    await Storage.refillCashier(state, cashier, refillInformation);
  };

  public func updateGatewayPrincipals(state : Storage.State) : async () {
    await Storage.updateGatewayPrincipals(state);
  };

  public func blobIsLive(hash : Blob) : Bool {
    true; // Stubbed: Prim.isStorageBlobLive(hash);
  };

  public func blobsToDelete(state : Storage.State, caller : Principal) : [Blob] {
    if (not Storage.isAuthorized(state, caller)) {
      Debug.trap("Unauthorized access");
    };
    []; // Stubbed: Prim.getDeadBlobs();
    /*
    let deadBlobs = Prim.getDeadBlobs();
    switch (deadBlobs) {
      case (null) {
        [];
      };
      case (?deadBlobs) {
        deadBlobs.sliceToArray(0, 10000);
      };
    };
    */
  };

  public func confirmBlobDeletion(state : Storage.State, caller : Principal, blobs : [Blob]) : async () {
    if (not Storage.isAuthorized(state, caller)) {
      Debug.trap("Unauthorized access");
    };
    // Stubbed: Prim.pruneConfirmedDeadBlobs(blobs);
    // Trigger GC forcefully if possible, but standard actors don't easily allow this via Prim.getSelfPrincipal() cast.
    // Simplifying for standard Motoko compatibility.
  };

  public func createCertificate(blobHash : Text) : _medicalcareStorageCreateCertificateResult {
    {
      method = "upload";
      blob_hash = blobHash;
    };
  };
};
