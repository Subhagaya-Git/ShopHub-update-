import { SkeletonGrid } from './ui/Skeleton';

export default function Spinner({ count = 8 }) {
  return <SkeletonGrid count={count} />;
}
