import { Student } from '../types';
import { Modal } from './ui/Modal';

interface ViewStudentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewStudentModal({ student, isOpen, onClose }: ViewStudentModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.type}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.country}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">State</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.state}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.address}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                <dd className="mt-1 text-sm text-gray-900">₹{student.amountPaid}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Due Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">₹{student.dueAmount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Discount</dt>
                <dd className="mt-1 text-sm text-gray-900">₹{student.discount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Incentives Paid</dt>
                <dd className="mt-1 text-sm text-gray-900">₹{student.incentivesPaid}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      student.activityStatus === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {student.activityStatus}
                  </span>
                </dd>
              </div>
              {student.inactivityReason && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Inactivity Reason</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.inactivityReason}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Date of Joining</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(student.dateOfJoining).toLocaleDateString()}
                </dd>
              </div>
              {student.inactiveOn && (
                <>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Inactive On</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(student.inactiveOn).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expires In</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {calculateExpiresIn(student.inactiveOn)}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation</h3>
          <dl>
            <div>
              <dt className="text-sm font-medium text-gray-500">Government ID Proof</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.governmentIdProof}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Modal>
  );
}