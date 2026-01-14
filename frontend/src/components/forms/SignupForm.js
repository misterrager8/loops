import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import api from "../../util";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function SignupForm({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangePasswordConfirm = (e) => setPasswordConfirm(e.target.value);

  const signup = (e) => {
    multiCtx.setLoading(true);
    e.preventDefault();
    api(
      "signup",
      {
        email: email,
        username: username,
        password: password,
        passwordConfirm: passwordConfirm,
      },
      (data) => {
        multiCtx.setCurrentUser(data.user);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <form onSubmit={(e) => signup(e)} className={className}>
      <Input
        type_="email"
        onChange={onChangeEmail}
        value={email}
        className="mb-1"
        placeholder="E=mail Address"
      />
      <Input
        onChange={onChangeUsername}
        value={username}
        className="mb-1"
        placeholder="Username"
      />
      <Input
        onChange={onChangePassword}
        value={password}
        className="mb-1"
        type_="password"
        placeholder="Password"
      />
      <Input
        onChange={onChangePasswordConfirm}
        value={passwordConfirm}
        className="mb-1"
        type_="password"
        placeholder="Confirm Password"
      />
      <Button type_="submit" text="Sign Up" className="w-100" />
    </form>
  );
}
