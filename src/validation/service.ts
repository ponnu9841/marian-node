import * as Joi from "joi";

export function validateServicePostRequest(service: ServicePostRequest) {
   const JoiSchema = Joi.object({
      title: Joi.string().min(3).required(),
      alt: Joi.string(),
      short_description: Joi.string().min(3).required(),
      long_description: Joi.string().min(3),
   }).options({ abortEarly: false });

   return JoiSchema.validate(service);
}

export function validateServicePutRequest(service: ServicePutRequest) {
   const JoiSchema = Joi.object({
      id: Joi.string().required(),
      alt: Joi.string(),
      short_description: Joi.string().min(3),
      long_description: Joi.string().min(3),
   }).options({ abortEarly: false });

   return JoiSchema.validate(service);
}
