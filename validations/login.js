export const validate = values => {
    const errors = {};

    if (!values.phone) {

        errors.phone = "Le champs phone est obligatoire";

    }


    if (!values.code) {

        errors.code = "Le champs code est obligatoire"

    }

    return errors;
};