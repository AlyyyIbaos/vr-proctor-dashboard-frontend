import StudentLayout from "../component/layout/StudentLayout";

export default function StudentProfilePage() {
  const fullName = localStorage.getItem("full_name") || "—";
  const email = localStorage.getItem("email") || "—";
  const studentNumber = localStorage.getItem("student_number") || "—";
  const program = localStorage.getItem("program") || "—";
  const yearLevel = localStorage.getItem("year_level") || "—";

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow space-y-6">
        <h2 className="text-2xl font-bold text-pup-maroon">Student Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-semibold">{fullName}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{email}</p>
          </div>

          <div>
            <p className="text-gray-500">Student Number</p>
            <p className="font-semibold">{studentNumber}</p>
          </div>

          <div>
            <p className="text-gray-500">Program</p>
            <p className="font-semibold">{program}</p>
          </div>

          <div>
            <p className="text-gray-500">Year Level</p>
            <p className="font-semibold">{yearLevel}</p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
