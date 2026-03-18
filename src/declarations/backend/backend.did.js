export const idlFactory = ({ IDL }) => {
  const BloodType = IDL.Variant({
    'aNegative' : IDL.Null,
    'oPositive' : IDL.Null,
    'abPositive' : IDL.Null,
    'bPositive' : IDL.Null,
    'aPositive' : IDL.Null,
    'oNegative' : IDL.Null,
    'abNegative' : IDL.Null,
    'bNegative' : IDL.Null,
  });
  const EmergencyContact = IDL.Record({
    'relationship' : IDL.Text,
    'name' : IDL.Text,
    'phone' : IDL.Text,
  });
  const Allergy = IDL.Record({
    'name' : IDL.Text,
    'severity' : IDL.Text,
    'reaction' : IDL.Text,
  });
  const UserProfile = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'bloodType' : IDL.Opt(BloodType),
    'dateOfBirth' : IDL.Opt(IDL.Int),
    'name' : IDL.Text,
    'emergencyContact' : IDL.Opt(EmergencyContact),
    'email' : IDL.Opt(IDL.Text),
    'allergies' : IDL.Vec(Allergy),
  });
  return IDL.Service({
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], []),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
