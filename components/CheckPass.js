import React, { useState } from "react";

export default function CheckPass(props) {
  const [pass, setPass] = useState("");
  const [submitted, setSubmit] = useState(false);

  const onSubmitPass = async (e) => {
    e.preventDefault();
    if (pass == props.password) {
      props.setMatch(true);
    }
    setPass("");
    setSubmit(true);
  };

  return (
    <div className="pass">
      <form onSubmit={onSubmitPass}>
        <a>Password:</a>
        <input
          name="password"
          value={pass}
          placeholder="insert password"
          onChange={(e) => setPass(e.target.value)}
        ></input>
        <button type="submit" className="btn-green">
          Submit passoword
        </button>
      </form>
      <PassMessage submitted={submitted} passMatch={props.passMatch} />
    </div>
  );
}

function PassMessage({ submitted, passMatch }) {
  if (submitted && !passMatch) {
    return <p className="text-danger">Password incorrect</p>;
  } else {
    return <p></p>;
  }
}
