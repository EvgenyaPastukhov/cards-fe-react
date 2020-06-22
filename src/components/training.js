import React from 'react';
import { withRouter } from "react-router-dom";

function Training(props) {
    return <p>training {props.match.params.id} will be here</p>;
}

export default withRouter(Training);