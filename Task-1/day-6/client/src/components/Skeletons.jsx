export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton h-4 rounded"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonCircle = ({ size = 40, className = '' }) => (
  <div className={`skeleton rounded-full ${className}`} style={{ width: size, height: size }} />
);

export const ItemSkeleton = () => (
  <div className="flex items-start gap-4 p-4">
    <SkeletonCircle size={40} />
    <div className="flex-1">
      <SkeletonText lines={1} className="mb-2" />
      <SkeletonText lines={1} />
    </div>
  </div>
);

export const FolderSkeleton = () => (
  <div className="bg-white p-4 rounded-xl border border-slate-200">
    <div className="flex items-center gap-3">
      <SkeletonCircle size={40} />
      <div className="flex-1">
        <SkeletonText lines={1} className="mb-2" />
        <SkeletonText lines={1} />
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="bg-white p-4 rounded-xl border border-slate-200">
    <SkeletonCircle size={48} className="mb-3" />
    <SkeletonText lines={1} className="mb-1" />
    <SkeletonText lines={1} />
  </div>
);

export const GridSkeleton = ({ count = 5, type = 'category' }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        {type === 'category' && <CategorySkeleton />}
        {type === 'folder' && <FolderSkeleton />}
      </div>
    ))}
  </div>
);

export const ListSkeleton = ({ count = 5 }) => (
  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
    {Array.from({ length: count }).map((_, i) => (
      <ItemSkeleton key={i} />
    ))}
  </div>
);

export default SkeletonCard;
