import React, { useEffect } from "react";
import { useGetIdentity, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface IUserEditProps {
    onClose: () => void;
}

type UserProfile = {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    //avatar?: string;
    role?: string;
};

export const UserEdit: React.FC<IUserEditProps> = ({ onClose }) => {
    const { data: user } = useGetIdentity<UserProfile>();
    const { mutate: update, isLoading: isUpdating } = useUpdate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserProfile>({
        defaultValues: user,
    });

    useEffect(() => {
        if (user) reset(user);
    }, [user, reset]);

    const handleUpdate = async (formData: UserProfile) => {
        formData = {
            id: formData.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            //role: formData.role
        };

        if (!user?.id) {
            console.error("User ID missing");
            return;
        }

        formData.id = user.id; // Ensure the ID is set for the update

        console.log("Updating user with data:", formData);
        const token = localStorage.getItem("token");

        update(
            {
                resource: "users/update",
                id: user.id, // necessário só para Refine, não será enviado no corpo se sua API não usa params
                values: formData, // isso vai com `id` incluso no body
                meta: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            },
            {
                onSuccess: () => onClose(),
                onError: (err) => console.error("Error updating user:", err),
            }
        );

    };

    return (
        <div>
            <div>
                <button
                    className="absolute right-4 text-base-content"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className="form-control mb-4">
                        <label className="label">First Name</label>
                        <input
                            className="input input-bordered input-sm"
                            {...register("firstName", { required: "Required field" })}
                        />
                        <span className="text-red-600 text-sm">{typeof errors.firstName?.message === "string" ? errors.firstName.message : ""}</span>
                    </div>
                    <div className="form-control mb-4">
                        <label className="label">Last Name</label>
                        <input
                            className="input input-bordered input-sm"
                            {...register("lastName", { required: "Required field" })}
                        />
                        <span className="text-red-600 text-sm">{typeof errors.lastName?.message === "string" ? errors.lastName.message : ""}</span>
                    </div>
                    <div className="form-control mb-4">
                        <label className="label">Email</label>
                        <input
                            className="input input-bordered input-sm"
                            type="email"
                            {...register("email", { required: "Required field" })}
                        />
                        <span className="text-red-600 text-sm">{typeof errors.email?.message === "string" ? errors.email.message : ""}</span>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">Phone Number</label>
                        <input
                            className="input input-bordered input-sm"
                            type="tel"
                            {...register("phoneNumber")}
                        />
                        <span className="text-red-600 text-sm">{typeof errors.phoneNumber?.message === "string" ? errors.phoneNumber.message : ""}</span>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="btn btn-primary btn-sm"
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
