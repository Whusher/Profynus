export default function RouteLoader() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-black px-6 text-white'>
      <div className='w-full max-w-md rounded-3xl border-(--prof-border) bg-(--prof-bg-elevated-strong) p-8 text-center shadow-[0_20px_60px_rgba(2,12,27,0.55)]'>
        <div className='mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-(--prof-border) border-t-(--prof-accent)' />
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-(--prof-accent)'>Profynus</p>
        <p className='mt-3 text-lg font-medium text-white'>Loading workspace</p>
        <p className='mt-2 text-sm leading-6 text-slate-400'>Preparing the next music flow and splitting route bundles for faster navigation.</p>
      </div>
    </div>
  )
}