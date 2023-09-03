export const validate = (name: string, email: string) => {
  if (name === "") {
    alert("名前を入力してください");
    return false;
  }
  if (email === "") {
    alert("メールアドレスを入力してください");
    return false;
  }
  return true;
};
