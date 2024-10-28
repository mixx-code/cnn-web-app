import React from "react";

interface Review {
  username: string;
  role: string;
  satisfaction: string;
  comment: string;
}

const reviews: Review[] = [
  {
    username: "user038429374032",
    role: "Tamu",
    satisfaction: "Puas",
    comment: "Hasil prediksinya cukup akurat dengan gambar yang saya berikan",
  },
  {
    username: "user324343422433",
    role: "Tamu",
    satisfaction: "Kurang Puas",
    comment: "Hasil prediksinya kurang akurat dengan gambar yang saya berikan",
  },
  {
    username: "user345678765854",
    role: "Tamu",
    satisfaction: "Tidak Puas",
    comment: "Hasil prediksinya tidak akurat dengan gambar yang saya berikan",
  },
  {
    username: "rizki_saja",
    role: "User",
    satisfaction: "Puas",
    comment: "Hasil prediksinya cukup akurat dengan gambar yang saya berikan",
  },
];

const Reviews: React.FC = () => {
  return (
    <div className="bg-white mt-6 p-4 rounded-md shadow-md">
      <h2 className="font-bold text-xl mb-4">Ulasan</h2>
      <div className="space-y-4 text-gray-700">
        {reviews.map((review, index) => (
          <div key={index}>
            <p>
              <strong>{review.username}</strong> | {review.role} |{" "}
              {review.satisfaction}
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
