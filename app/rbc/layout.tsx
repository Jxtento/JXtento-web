export default function RbcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white pt-20">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
