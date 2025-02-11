import AccountDetails from "@/components/account/AccountDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ account: string }>
}) {
  const account = (await params).account;
  return <AccountDetails accountId={account} />
}
