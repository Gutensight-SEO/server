/** @format */


const calculateMaxRequests = (subscriptionType: string) => {
  switch (subscriptionType) {
    case 'free':
      return 100;
    case 'basic':
      return 1000;
    case 'starter':
      return 10000;
    case 'corporate':
      return 100000;
    default:
      return 100;
  }
};

export default calculateMaxRequests;