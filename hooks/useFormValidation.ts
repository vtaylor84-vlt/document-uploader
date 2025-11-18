import { useMemo } from 'react';
import { LoadSubmission, SelectedFile } from '../types';

export const useFormValidation = (form: LoadSubmission, files: SelectedFile[]) => {
    const isValid = useMemo(() => {
        const hasCompanyAndDriver = form.company !== 'default' && form.driverName.trim().length > 0;
        const hasIdentification = form.loadNumber.trim().length > 0 || 
                                 form.bolNumber.trim().length > 0 || 
                                 (form.pickupCity.trim().length > 0 && form.deliveryCity.trim().length > 0);
        const hasFiles = files.length > 0;

        return hasCompanyAndDriver && hasIdentification && hasFiles;
    }, [form, files]);

    return { isValid };
};