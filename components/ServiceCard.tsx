import Link from "next/link";

export type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={service.image}
        alt={service.serviceName}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-medium text-rose-600">
          {service.category}
        </span>
        <h3 className="text-lg font-semibold">{service.serviceName}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {service.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-rose-700">৳{service.price}</span>
          <span className="text-gray-500">{service.duration} min</span>
        </div>
        <Link
          href={`/services/${service._id}`}
          className="mt-4 rounded bg-rose-600 py-2 text-center text-sm text-white hover:bg-rose-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}