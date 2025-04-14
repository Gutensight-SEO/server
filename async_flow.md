#


## Functions that should use Kafka:

1. auth.controller.ts
// Async Processing:
- register     // Heavy operation: password hashing, DB creation

2. post.controller.ts
// Async Processing:
- createPost   // DB write, cache updates
- updatePost   // DB write, cache invalidation
- deletePost
- deletePosts  // Bulk operation, cache cleanup

3. user.controller.ts
// Already implemented for:
- updateUser   // DB write, cache updates

// Should also add for:
- deleteUser   // DB deletion, cache cleanup

4. payment.subscription.ts
// Async Processing:
- verifyPaystack        // External API call, DB write
- submitCryptoTransaction  // Complex verification, DB write


## Functions that should remain synchronous:

1. streaming.controller.ts
- getResponse  // Keep sync (used for checking async results)

2. subscription.controller.ts
- listSubscriptions     // Simple read operation
- getUserApiKeys       // Simple read operation

3. auth.controller.ts
- login        // Needs immediate response
- refreshToken // Needs immediate response

4. post.controller.ts
- getPost    // Read operation
- getPosts   // Read operation with pagination

5. user.controller.ts
- getUser    // Read operation
- getUsers   // Read operation

