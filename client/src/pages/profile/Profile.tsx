import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Sample user profile data - would be fetched from API in a real app
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    avatar: null,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle profile form input changes
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change for avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // In a real app, you would upload the image to your server/cloud storage
      // and get back a URL to store in your profile
    }
  };

  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null);
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would implement the API call to update the profile
    console.log("Updated profile:", profile);

    // Show success message
    setSuccessMessage("Profile updated successfully!");
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    // Here you would implement the API call to change the password
    console.log("Password change data:", passwordData);

    // Show success message
    setSuccessMessage("Password updated successfully!");
    setShowSuccess(true);

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // Function to get initials from name for avatar placeholder
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Container fluid className="p-4 bg-light h-100">
      {showSuccess && (
        <Alert
          variant="success"
          onClose={() => setShowSuccess(false)}
          dismissible
          className="mb-4 animate__animated animate__fadeIn"
        >
          {successMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">My Profile</h2>
          <p className="text-muted">
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      <Card className="border-0 shadow">
        <Card.Body className="p-4">
          <Row>
            {/* Profile Information Section */}
            <Col lg={6} className="mb-4 mb-lg-0">
              <h4 className="mb-4 d-flex align-items-center">
                <i className="bi bi-person-circle me-2 text-primary"></i>
                Profile Information
              </h4>

              <div className="d-flex flex-column flex-md-row align-items-center mb-4">
                <div className="text-center mb-4 mb-md-0">
                  {imagePreview || profile.avatar ? (
                    <div
                      className="rounded-circle overflow-hidden"
                      style={{
                        width: "120px",
                        height: "120px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={imagePreview || profile.avatar || ""}
                        alt="Profile"
                        className="w-100 h-100 object-cover"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "120px",
                        height: "120px",
                        fontSize: "3rem",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      {getInitials(profile.name)}
                    </div>
                  )}
                  <div className="mt-3">
                    <label
                      htmlFor="avatar-upload"
                      className="btn btn-outline-primary rounded-pill btn-sm"
                    >
                      <i className="bi bi-camera-fill me-2"></i> Change Avatar
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <Form
                  className="ms-md-4 flex-grow-1 w-100"
                  onSubmit={handleProfileSubmit}
                >
                  <Form.Group className="mb-3" controlId="profileName">
                    <Form.Label>Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className="shadow-sm"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="profileEmail">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope-fill"></i>
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="shadow-sm"
                        required
                      />
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary" type="submit" className="px-4">
                      <i className="bi bi-check-circle me-2"></i>
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>

            {/* Security Information Section */}
            <Col lg={6} className="border-start-lg">
              <h4 className="mb-4 d-flex align-items-center">
                <i className="bi bi-shield-lock-fill me-2 text-primary"></i>
                Security Settings
              </h4>

              <Form onSubmit={handlePasswordSubmit}>
                {passwordError && (
                  <Alert variant="danger" className="mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {passwordError}
                  </Alert>
                )}

                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key-fill"></i>
                    </span>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="shadow-sm"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="shadow-sm"
                      required
                    />
                  </div>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Password must be at least 8 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-check2-circle"></i>
                    </span>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="shadow-sm"
                      required
                    />
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" className="px-4">
                    <i className="bi bi-shield-check me-2"></i>
                    Update Password
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
