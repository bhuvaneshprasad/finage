export default async function AmcCode({
  params,
}: {
  params: { amcCode: string };
}) {
  const { amcCode } = await params;
  return (
    <div className="pt-28">
      <h1>AMC Details for Code: {amcCode}</h1>
    </div>
  );
}
