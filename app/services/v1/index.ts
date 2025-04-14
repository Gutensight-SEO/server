/** @format */


import * as authService from "./auth.service";
import * as userService from "./user.service";
// import * as postService from "./post.service";
// import * as commentService from "./comment.service";
// import * as notificationService from "./notification.service";
import * as subscriptionService from "./subscription.service";
import * as subscriptionPlanService from "./subscriptionPlan.service";
// import * as paymentService from "./payment.service";
// import * as postService from "./post.service";


export const v1Services = {
    ...authService,
    ...userService,
    // ...postService,
    // ...commentService,
    // ...notificationService,
    ...subscriptionService,
    ...subscriptionPlanService,
    // ...paymentService,
    // ...apiKeysService
}
