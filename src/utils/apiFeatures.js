class APIfeatures{
    // Goal of this utility:
    // Build reusable query features (filter, sort, field limit, pagination, search)
    // so controllers stay clean and only call chained methods.

    // Suggested constructor inputs:
    // 1) mongooseQuery -> e.g., Post.find()
    // 2) queryString -> req.query
    // Store both on `this` so every method can read/update them.
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    // paginate()
    // - Read page + limit from query string.
    // - Calculate skip = (page - 1) * limit.
    // - Apply skip/limit to mongooseQuery.
    // - Return `this`.

    paginate(){
        const page = Math.max(1, Number(this.queryString.page) || 1);
        const limit = Math.max(1, Number(this.queryString.limit) || 10);
        const skip = (page -1) * limit;

        this.query = this.query.limit(limit).skip(skip);

        return this;
    }
    
    // How controllers should use this class:
    // const features = new APIfeatures(Post.find(), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate()
    //   .search();
    // const posts = await features.query;

    // Important implementation notes:
    // - Keep each method focused on one concern.
    // - Always return `this` to support chaining.
    // - Do not execute query inside methods; execute in controller with await.
    // - Validate page/limit edge cases (negative, zero, very large values).
    // - Keep query keys consistent across frontend + backend.
}

export default APIfeatures;
