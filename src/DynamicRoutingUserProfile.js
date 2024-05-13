import React from "react";

import { useParams } from "react-router-dom";

const DynamicRoutingUserProfile = () => {

    let { id: userId } = useParams();

    return (
        <div>User ID: {userId}</div>
    )
}

export default DynamicRoutingUserProfile;