import type { RootState } from "@/redux/Store";
import { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { logoutUser } from "@/Service/apiService";

interface ProfileFormData {
  userName: string;
  email: string;
}

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] =
    useUpdateAvatarMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      userName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("userName", user.userName || "");
      setValue("email", user.email || "");
    }
    
  }, [user, setValue]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        userName: data.userName,
        email: data.email,
      }).unwrap();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await updateAvatar(formData).unwrap();
      toast.success("Avatar updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update avatar");
      setPreviewImage(null);
    }
  };

  const handleLogout=async ()=>{
    try {
      await logoutUser();
      toast.success("User Logout Succesfully") 
      window.location.reload();
    } catch (error) {
       toast.error("Unable to Logout") 
    }
  }

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <div className="mb-3">
        <h2 className="mb-1">My Profile</h2>
        <p className="text-muted">
          Manage your personal information and account settings
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-lg-5 p-4">
          <div className="d-flex align-items-center mb-4">
            <i className="bi bi-person-circle text-primary me-2"></i>
            <h5 className="mb-0 fw-semibold">Profile Information</h5>
          </div>

          <Row>
            <Col lg={4} md={5} className="text-center mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                {isUpdatingAvatar ? (
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "180px", height: "180px" }}
                  >
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : previewImage ? (
                  <div
                    className="rounded-circle overflow-hidden"
                    style={{ width: "180px", height: "180px" }}
                  >
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : user?.avatar?.url ? (
                  <div
                    className="rounded-circle overflow-hidden"
                    style={{ width: "180px", height: "180px" }}
                  >
                    <img
                      src={user.avatar.url}
                      alt="Profile"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "180px",
                      height: "180px",
                      fontSize: "4rem",
                    }}
                  >
                    {user?.userName?.charAt(0) || "U"}
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: "40px",
                    height: "40px",
                    bottom: "5px",
                    right: "5px",
                    cursor: "pointer",
                    border: "2px solid #fff",
                  }}
                >
                  <i className="bi bi-camera text-primary fs-5"></i>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  className="d-none"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  disabled={isUpdatingAvatar}
                />
              </div>
            </Col>

            <Col lg={8} md={7}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-4" controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text border-end-0 bg-transparent">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      className="border-start-0"
                      isInvalid={!!errors.userName}
                      {...register("userName", {
                        required: "Name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.userName && (
                    <Form.Text className="text-danger">
                      {errors.userName.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-4" controlId="emailAddress">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text border-end-0 bg-transparent">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email address"
                      className="border-start-0"
                      isInvalid={!!errors.email}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <Form.Text className="text-danger">
                      {errors.email.message}
                    </Form.Text>
                  )}
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4" controlId="joinedDate">
                      <Form.Label>Joined Date</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text border-end-0 bg-transparent">
                          <i className="bi bi-calendar text-muted"></i>
                        </span>
                        <Form.Control
                          type="text"
                          value={formatDate(user?.createdAt)}
                          className="border-start-0 bg-light"
                          disabled
                          readOnly
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4 gap-2">
                  <Button variant="danger" onClick={handleLogout} className="px-4 py-2 rounded-pill">
                    Logout
                  </Button>

                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 rounded-pill"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
