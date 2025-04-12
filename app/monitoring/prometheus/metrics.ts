/** @format */


import client from "prom-client";


// create a registry which registers the metrics
const register = new client.Registry();

const requestCount = new client.Counter({
    name: "node_request_operations_total",
    help: "The total number of processed requests",
});

const userCount = new client.Counter({
    name: "users_count",
    help: "Number of registered users",
});

const postCount = new client.Counter({
    name: "posts_count",
    help: "Number of posts posted / replied to"
});

register.registerMetric(requestCount);
register.registerMetric(userCount);
register.registerMetric(postCount);

// add a default label 
register.setDefaultLabels({
    app: "MERN_TEMPLATE_API",
});

// enable the collection of default metrics
client.collectDefaultMetrics({ register });

export { register, requestCount, userCount, postCount }