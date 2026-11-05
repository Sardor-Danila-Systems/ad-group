/** Dark placeholder while the showroom streams in (also the Suspense boundary for the segment's params). */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="fixed inset-0 grid place-items-center bg-ink">
      <div className="w-[min(200px,60vw)]">
        <div className="h-px w-full overflow-hidden bg-gold/25">
          <div className="loader-bar h-full origin-left bg-gold" />
        </div>
      </div>
    </div>
  );
}
