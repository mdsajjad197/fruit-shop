export default function SkeletonCard() {
    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden p-3 shadow-sm">
            {/* Image Placeholder */}
            <div className="w-full aspect-square bg-gray-50 rounded-[2rem] animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>

            <div className="p-4 space-y-4">
                {/* Title & Tag */}
                <div className="flex justify-between items-start gap-4">
                    <div className="h-6 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-5 w-12 bg-gray-50 rounded-full animate-pulse" />
                </div>

                {/* Meta Information */}
                <div className="space-y-2">
                    <div className="h-3 w-1/3 bg-gray-50 rounded-md animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-50 rounded-md animate-pulse opacity-50" />
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-8 w-24 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-12 w-12 bg-primary-500/5 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}

