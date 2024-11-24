import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Search, UserPlus, Edit2, Eye, LogOut, ClipboardList } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { AddStudentForm } from './AddStudentForm';
import { EditStudentForm } from './EditStudentForm';
import { ViewStudentModal } from './ViewStudentModal';
import { Student } from '../types';
import { useAuthStore } from '../store/authStore';
import { useStudentStore } from '../store/studentStore';
import { useLogStore } from '../store/logStore';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { students, setStudents, addStudent: addStudentToStore, updateStudent: updateStudentInStore } = useStudentStore();
  const { logs, addLog } = useLogStore();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      searchTerm: '',
    },
  });

  useEffect(() => {
    // Check for students that should be marked as inactive
    const today = new Date().toISOString().split('T')[0];
    const updatedStudents = students.map(student => {
      if (student.inactiveOn && student.inactiveOn <= today && student.activityStatus === 'ACTIVE') {
        return {
          ...student,
          activityStatus: 'INACTIVE',
          inactivityReason: 'Automatically marked inactive based on scheduled date'
        };
      }
      return student;
    });

    if (JSON.stringify(updatedStudents) !== JSON.stringify(students)) {
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    }
  }, [students, setStudents]);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const onSearch = (data: { searchTerm: string }) => {
    const searchTerm = data.searchTerm.toLowerCase();
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.phoneNumber.includes(searchTerm) ||
      student.type.toLowerCase().includes(searchTerm)
    );
    setFilteredStudents(filtered);
  };

  const handleAddStudent = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...data,
      id: (students.length + 1).toString(),
    };
    addStudentToStore(newStudent);
    setFilteredStudents([...students, newStudent]);
    setIsAddModalOpen(false);

    // Add log entry
    if (user) {
      addLog({
        adminName: user.name,
        adminEmail: user.email,
        action: 'ADD',
        studentName: newStudent.name,
        studentId: newStudent.id,
        details: `Added new student with phone number ${newStudent.phoneNumber}`
      });
    }
  };

  const handleEditStudent = (data: Student) => {
    updateStudentInStore(data);
    setFilteredStudents(students.map((student) =>
      student.id === data.id ? data : student
    ));
    setIsEditModalOpen(false);
    setSelectedStudent(null);

    // Add log entry
    if (user) {
      addLog({
        adminName: user.name,
        adminEmail: user.email,
        action: 'UPDATE',
        studentName: data.name,
        studentId: data.id,
        details: `Updated student information`
      });
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const existingPhoneNumbers = students.map(student => student.phoneNumber);

  const calculateExpiresIn = (inactiveOn?: string) => {
    if (!inactiveOn) return null;
    
    const today = new Date();
    const inactiveDate = new Date(inactiveOn);
    const diffTime = inactiveDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setIsLogsModalOpen(true)} 
              variant="outline"
              className="flex items-center"
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              View Logs
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <form
            onSubmit={handleSubmit(onSearch)}
            className="flex gap-4 items-center"
          >
            <div className="flex-1">
              <Input
                {...register('searchTerm')}
                placeholder="Search by name, email, phone..."
                className="w-full"
              />
            </div>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </form>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Expires In
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {student.type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {student.phoneNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        student.activityStatus === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.activityStatus}
                      {student.inactivityReason && (
                        <span className="ml-1">({student.inactivityReason})</span>
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {student.inactiveOn && calculateExpiresIn(student.inactiveOn)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student"
      >
        <AddStudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setIsAddModalOpen(false)}
          existingPhoneNumbers={existingPhoneNumbers}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        title="Edit Student"
      >
        {selectedStudent && (
          <EditStudentForm
            student={selectedStudent}
            onSubmit={handleEditStudent}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedStudent(null);
            }}
            existingPhoneNumbers={existingPhoneNumbers}
          />
        )}
      </Modal>

      {selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}

      <Modal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        title="Activity Logs"
      >
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border-l-4 border-indigo-500 pl-4 py-2"
            >
              <p className="text-sm text-gray-600">
                {new Date(log.timestamp).toLocaleString()}
              </p>
              <p className="font-medium">
                {log.adminName} ({log.adminEmail})
              </p>
              <p>
                {log.action === 'ADD' ? 'Added' : 'Updated'} student:{' '}
                <span className="font-medium">{log.studentName}</span>
              </p>
              <p className="text-sm text-gray-600">{log.details}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-center text-gray-500">No activity logs yet</p>
          )}
        </div>
      </Modal>
    </div>
  );
}