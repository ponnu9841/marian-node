type ServicePostRequest = ImageRequest & {
   title: string;
   short_description?: string;
   long_description?: string;
};

type ServicePutRequest = {
   id: string;
   title?: string;
   image?: string;
   alt?: string;
   short_description?: string;
   long_description?: string;
};
