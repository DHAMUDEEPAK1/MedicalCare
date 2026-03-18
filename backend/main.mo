import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



persistent actor {
  transient let accessControlState = AccessControl.initState();
  transient let storageState = MixinStorage.initState();

  // --- Authorization Methods ---

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    await MixinAuthorization._initializeAccessControlWithSecret(accessControlState, caller, userSecret);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    MixinAuthorization.getCallerUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    MixinAuthorization.assignCallerUserRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    MixinAuthorization.isCallerAdmin(accessControlState, caller);
  };

  // --- Storage Methods ---

  public shared ({ caller }) func _medicalcareStorageRefillCashier(refillInformation : ?MixinStorage._medicalcareStorageRefillInformation) : async MixinStorage._medicalcareStorageRefillResult {
    await MixinStorage.refillCashier(storageState, caller, refillInformation);
  };

  public shared ({ caller }) func _medicalcareStorageUpdateGatewayPrincipals() : async () {
    await MixinStorage.updateGatewayPrincipals(storageState);
  };

  public query ({ caller }) func _medicalcareStorageBlobIsLive(hash : Blob) : async Bool {
    MixinStorage.blobIsLive(hash);
  };

  public query ({ caller }) func _medicalcareStorageBlobsToDelete() : async [Blob] {
    MixinStorage.blobsToDelete(storageState, caller);
  };

  public shared ({ caller }) func _medicalcareStorageConfirmBlobDeletion(blobs : [Blob]) : async () {
    await MixinStorage.confirmBlobDeletion(storageState, caller, blobs);
  };

  public shared ({ caller }) func _medicalcareStorageCreateCertificate(blobHash : Text) : async MixinStorage._medicalcareStorageCreateCertificateResult {
    MixinStorage.createCertificate(blobHash);
  };

  // --- App Types ---

  public type Credentials = {
    phoneNumber : Text;
    hashedPassword : Text;
  };

  public type BloodType = {
    #aPositive;
    #aNegative;
    #bPositive;
    #bNegative;
    #abPositive;
    #abNegative;
    #oPositive;
    #oNegative;
  };

  public type EmergencyContact = {
    name : Text;
    phone : Text;
    relationship : Text;
  };

  public type Allergy = {
    name : Text;
    severity : Text;
    reaction : Text;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    location : ?Text;
    company : ?Text;
    website : ?Text;
    bio : ?Text;
    image : ?Text;
    dateOfBirth : ?Int;
    bloodType : ?BloodType;
    allergies : [Allergy];
    emergencyContact : ?EmergencyContact;
  };

  public type MLInput = {
    age : Nat;
    gender : Text;
    cholesterol : Nat;
    bloodPressure : Nat;
    bmi : Nat;
    heartRate : Nat;
    smokingStatus : Text;
    diabetesStatus : Text;
    exerciseFrequency : Nat;
    medicationAdherence : Text;
    saltIntake : Text;
    stressLevel : Text;
    sleepQuality : Text;
  };

  public type MLPrediction = {
    riskLevel : Text;
    confidence : Nat;
    modelVersion : Text;
    timestamp : Int;
    featureWeights : [(Text, Nat)];
  };

  public type MedicalFileMetadata = {
    id : Text;
    filename : Text;
    size : Nat;
    uploadedAt : Time.Time;
    contentType : ?Text;
  };

  // --- App State ---

  transient let credentials = HashMap.HashMap<Principal, Credentials>(10, Principal.equal, Principal.hash);
  transient let userProfiles = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
  transient let mlPredictions = HashMap.HashMap<Principal, MLPrediction>(10, Principal.equal, Principal.hash);

  // --- User Profile Methods ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };

    ignore userProfiles.put(caller, profile);
  };

  // --- Auth & Credentials Methods ---

  public shared ({ caller }) func addCredentials(phoneNumber : Text, hashedPassword : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add credentials");
    };
    ignore credentials.put(caller, { phoneNumber; hashedPassword });
  };

  public query ({ caller }) func verifyCredentials(phoneNumber : Text, hashedPassword : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can verify credentials");
    };

    switch (credentials.get(caller)) {
      case (null) { false };
      case (?creds) {
        creds.phoneNumber == phoneNumber and creds.hashedPassword == hashedPassword;
      };
    };
  };

  public query ({ caller }) func hasCredentials() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can check credentials");
    };

    switch (credentials.get(caller)) {
      case (null) { false };
      case (?_) { true };
    };
  };

  // --- Machine Learning Methods ---

  public shared ({ caller }) func runMLPrediction(input : MLInput) : async MLPrediction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can request predictions");
    };

    let riskScore = calculateRiskScore(input);
    let riskLevel = determineRiskLevel(riskScore);
    let featureWeights = calculateFeatureWeights(input);

    let prediction : MLPrediction = {
      riskLevel;
      confidence = 90;
      modelVersion = "1.0.0";
      timestamp = Time.now();
      featureWeights;
    };

    ignore mlPredictions.put(caller, prediction);
    prediction;
  };

  public query ({ caller }) func getCallerMLPrediction() : async ?MLPrediction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view predictions");
    };
    mlPredictions.get(caller);
  };

  public query ({ caller }) func getUserMLPrediction(user : Principal) : async ?MLPrediction {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own prediction");
    };
    mlPredictions.get(user);
  };

  public query ({ caller }) func getAllPredictions() : async [(Principal, MLPrediction)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can view all predictions");
    };
    Iter.toArray<(Principal, MLPrediction)>(mlPredictions.entries());
  };

  public query ({ caller }) func getFeatureImportance() : async [(Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view feature importance");
    };
    calculateGlobalFeatureImportance();
  };

  func calculateRiskScore(input : MLInput) : Nat {
    let ageScore = input.age * 2;
    let cholesterolScore = input.cholesterol * 3;
    let bloodPressureScore = input.bloodPressure * 2;
    let bmiScore = input.bmi * 2;
    let heartRateScore = input.heartRate * 1;

    let smokingScore = switch (input.smokingStatus) {
      case ("current") { 20 };
      case ("previous") { 10 };
      case (_) { 0 };
    };

    let diabetesScore = switch (input.diabetesStatus) {
      case ("yes") { 15 };
      case ("no") { 0 };
      case (_) { 0 };
    };

    let exerciseScore = if (input.exerciseFrequency >= 5) { 0 } else if (input.exerciseFrequency >= 3) {
      5;
    } else { 10 };

    let medicationScore = switch (input.medicationAdherence) {
      case ("good") { 0 };
      case ("moderate") { 5 };
      case (_) { 10 };
    };

    ageScore
    + cholesterolScore
    + bloodPressureScore
    + bmiScore
    + heartRateScore
    + smokingScore
    + diabetesScore
    + exerciseScore
    + medicationScore;
  };

  func determineRiskLevel(riskScore : Nat) : Text {
    if (riskScore <= 40) {
      "Low";
    } else if (riskScore <= 80) {
      "Moderate";
    } else {
      "High";
    };
  };

  func calculateFeatureWeights(input : MLInput) : [(Text, Nat)] {
    [
      ("age", 15),
      ("cholesterol", 20),
      ("bloodPressure", 20),
      ("bmi", 15),
      ("heartRate", 10),
      ("smokingStatus", 10),
      ("diabetesStatus", 10),
    ];
  };

  func calculateGlobalFeatureImportance() : [(Text, Nat)] {
    [
      ("age", 18),
      ("cholesterol", 22),
      ("bloodPressure", 20),
      ("bmi", 16),
      ("heartRate", 8),
      ("smokingStatus", 10),
      ("diabetesStatus", 6),
    ];
  };

  // --- Medical Files Management ---
  transient let medicalFiles = HashMap.HashMap<Principal, HashMap.HashMap<Text, Storage.ExternalBlob>>(10, Principal.equal, Principal.hash);
  transient let medicalFileMetadata = HashMap.HashMap<Principal, HashMap.HashMap<Text, MedicalFileMetadata>>(10, Principal.equal, Principal.hash);

  public shared ({ caller }) func uploadMedicalFile(
    id : Text,
    file : Storage.ExternalBlob,
    filename : Text,
    size : Nat,
    contentType : ?Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can upload files");
    };

    // Store file reference
    switch (medicalFiles.get(caller)) {
      case (null) {
        let userFiles = HashMap.HashMap<Text, Storage.ExternalBlob>(10, Text.equal, Text.hash);
        ignore userFiles.put(id, file);
        medicalFiles.put(caller, userFiles);
      };
      case (?userFiles) {
        ignore userFiles.put(id, file);
      };
    };

    // Store metadata
    let metadata : MedicalFileMetadata = {
      id;
      filename;
      size;
      uploadedAt = Time.now();
      contentType;
    };

    switch (medicalFileMetadata.get(caller)) {
      case (null) {
        let userMetadata = HashMap.HashMap<Text, MedicalFileMetadata>(10, Text.equal, Text.hash);
        ignore userMetadata.put(id, metadata);
        medicalFileMetadata.put(caller, userMetadata);
      };
      case (?userMetadata) {
        ignore userMetadata.put(id, metadata);
      };
    };

    id;
  };

  public query ({ caller }) func listMedicalFiles() : async [(Text, Storage.ExternalBlob)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can list files");
    };

    switch (medicalFiles.get(caller)) {
      case (null) { [] };
      case (?userFiles) {
        Iter.toArray<(Text, Storage.ExternalBlob)>(userFiles.entries());
      };
    };
  };

  public query ({ caller }) func getMedicalFile(id : Text) : async ?Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can download files");
    };

    switch (medicalFiles.get(caller)) {
      case (null) { null };
      case (?userFiles) {
        userFiles.get(id);
      };
    };
  };

  public shared ({ caller }) func deleteMedicalFile(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete files");
    };

    // Delete file
    switch (medicalFiles.get(caller)) {
      case (null) {};
      case (?userFiles) {
        ignore userFiles.remove(id);
      };
    };

    // Delete metadata
    switch (medicalFileMetadata.get(caller)) {
      case (null) {};
      case (?userMetadata) {
        ignore userMetadata.remove(id);
      };
    };

    true;
  };

  public query ({ caller }) func listMedicalFilesMetadata() : async [MedicalFileMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can list file metadata");
    };

    switch (medicalFileMetadata.get(caller)) {
      case (null) { [] };
      case (?userMetadata) {
        Iter.toArray<MedicalFileMetadata>(userMetadata.vals());
      };
    };
  };

  public query ({ caller }) func getMedicalFileMetadata(id : Text) : async ?MedicalFileMetadata {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get file metadata");
    };

    switch (medicalFileMetadata.get(caller)) {
      case (null) { null };
      case (?userMetadata) {
        userMetadata.get(id);
      };
    };
  };

  public query ({ caller }) func getLocation() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view location");
    };

    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) {
        profile.location;
      };
    };
  };

  public shared ({ caller }) func updateLocation(location : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update location");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Debug.trap("User profile not found");
      };
      case (?profile) {
        let updatedProfile = { profile with location = ?location };
        ignore userProfiles.put(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getMedicalReportsSummary() : async [(Text, MedicalFileMetadata)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access medical reports");
    };

    switch (medicalFileMetadata.get(caller)) {
      case (null) { [] };
      case (?userMetadata) {
        Iter.toArray<(Text, MedicalFileMetadata)>(userMetadata.entries());
      };
    };
  };

  public query ({ caller }) func getMedicalReportMetadata(id : Text) : async ?MedicalFileMetadata {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access medical reports");
    };

    switch (medicalFileMetadata.get(caller)) {
      case (null) { null };
      case (?userMetadata) {
        userMetadata.get(id);
      };
    };
  };
};
