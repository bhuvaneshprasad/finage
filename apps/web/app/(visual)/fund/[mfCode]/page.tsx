export default async function MFScheme({
  params,
}: {
  params: { mfCode: string };
}) {
  const { mfCode } = await params;
  return <div className="pt-28">MF Code: {mfCode}</div>;
}
