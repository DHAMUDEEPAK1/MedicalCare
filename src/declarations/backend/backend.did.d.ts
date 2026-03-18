import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Allergy {
  'name' : string,
  'severity' : string,
  'reaction' : string,
}
export type BloodType = { 'aNegative' : null } |
  { 'oPositive' : null } |
  { 'abPositive' : null } |
  { 'bPositive' : null } |
  { 'aPositive' : null } |
  { 'oNegative' : null } |
  { 'abNegative' : null } |
  { 'bNegative' : null };
export interface EmergencyContact {
  'relationship' : string,
  'name' : string,
  'phone' : string,
}
export interface UserProfile {
  'bio' : [] | [string],
  'bloodType' : [] | [BloodType],
  'dateOfBirth' : [] | [bigint],
  'name' : string,
  'emergencyContact' : [] | [EmergencyContact],
  'email' : [] | [string],
  'allergies' : Array<Allergy>,
}
export interface _SERVICE {
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'isAdmin' : ActorMethod<[], boolean>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
