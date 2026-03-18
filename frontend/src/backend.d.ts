import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Allergy {
    name: string;
    severity: string;
    reaction: string;
}
export interface MLInput {
    age: number;
    bmi: number;
    sleepQuality: string;
    saltIntake: string;
    stressLevel: string;
    bloodPressure: number;
    exerciseFrequency: number;
    heartRate: number;
    gender: string;
    smokingStatus: string;
    medicationAdherence: string;
    diabetesStatus: string;
    cholesterol: number;
}
export type Time = bigint;
export interface MedicalFileMetadata {
    id: string;
    contentType?: string;
    size: bigint;
    filename: string;
    uploadedAt: Time;
}
export interface EmergencyContact {
    relationship: string;
    name: string;
    phone: string;
}
export interface MLPrediction {
    featureWeights: Array<[string, number]>;
    modelVersion: string;
    timestamp: bigint;
    confidence: number;
    riskLevel: string;
}
export interface UserProfile {
    bio?: string;
    bloodType?: BloodType;
    dateOfBirth?: bigint;
    name: string;
    emergencyContact?: EmergencyContact;
    email?: string;
    website?: string;
    company?: string;
    image?: string;
    allergies: Array<Allergy>;
    location?: string;
}
export enum BloodType {
    aNegative = "aNegative",
    oPositive = "oPositive",
    abPositive = "abPositive",
    bPositive = "bPositive",
    aPositive = "aPositive",
    oNegative = "oNegative",
    abNegative = "abNegative",
    bNegative = "bNegative"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCredentials(phoneNumber: string, hashedPassword: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMedicalFile(id: string): Promise<boolean>;
    getAllPredictions(): Promise<Array<[Principal, MLPrediction]>>;
    getCallerMLPrediction(): Promise<MLPrediction | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeatureImportance(): Promise<Array<[string, number]>>;
    getLocation(): Promise<string | null>;
    getMedicalFile(id: string): Promise<ExternalBlob | null>;
    getMedicalFileMetadata(id: string): Promise<MedicalFileMetadata | null>;
    getMedicalReportMetadata(id: string): Promise<MedicalFileMetadata | null>;
    getMedicalReportsSummary(): Promise<Array<[string, MedicalFileMetadata]>>;
    getUserMLPrediction(user: Principal): Promise<MLPrediction | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasCredentials(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listMedicalFiles(): Promise<Array<[string, ExternalBlob]>>;
    listMedicalFilesMetadata(): Promise<Array<MedicalFileMetadata>>;
    runMLPrediction(input: MLInput): Promise<MLPrediction>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateLocation(location: string): Promise<void>;
    uploadMedicalFile(id: string, file: ExternalBlob, filename: string, size: bigint, contentType: string | null): Promise<string>;
    verifyCredentials(phoneNumber: string, hashedPassword: string): Promise<boolean>;
}
