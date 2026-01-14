import { useContext, useState } from "react";
import { MultiContext } from "../../Context";
import api from "../../util";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function LoginForm({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const login = (e) => {
    e.preventDefault();
    multiCtx.setLoading(true);
    api(
      "login",
      {
        username: username,
        password: password,
      },
      (data) => {
        multiCtx.setCurrentUser(data.user);
        multiCtx.setLoading(false);
      }
    );
  };

  return (
    <form onSubmit={(e) => login(e)} className={className}>
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
      <Button type_="submit" text="Log In" className="w-100" />
    </form>
  );
}
