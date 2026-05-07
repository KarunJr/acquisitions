interface Issues {
  message: string;
}

interface IErrors {
  issues: Issues[];
}

export const formatValidationError = (errors: IErrors): string => {
  if (!errors || !errors.issues) return 'Validation Failed';

  if (Array.isArray(errors.issues))
    return errors.issues.map(i => i.message).join(',');

  return JSON.stringify(errors);
};
