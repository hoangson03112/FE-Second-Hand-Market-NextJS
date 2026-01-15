"use client";

import { useState } from "react";

interface ShippingFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note?: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  defaultValues?: Partial<ShippingFormData>;
}

export default function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: defaultValues?.fullName || "",
    phone: defaultValues?.phone || "",
    email: defaultValues?.email || "",
    address: defaultValues?.address || "",
    city: defaultValues?.city || "",
    district: defaultValues?.district || "",
    ward: defaultValues?.ward || "",
    note: defaultValues?.note || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Auto-submit on change (for better UX)
  const handleChangeAndSubmit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newData);
    
    // Check if all required fields are filled
    if (
      newData.fullName &&
      newData.phone &&
      newData.email &&
      newData.address &&
      newData.city &&
      newData.district &&
      newData.ward
    ) {
      onSubmit(newData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Thông Tin Giao Hàng</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChangeAndSubmit}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChangeAndSubmit}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="0912345678"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChangeAndSubmit}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChangeAndSubmit}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="Số nhà, tên đường"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChangeAndSubmit}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="">Chọn Tỉnh/TP</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                {/* Add more cities */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChangeAndSubmit}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="">Chọn Quận/Huyện</option>
                <option value="district1">Quận 1</option>
                <option value="district2">Quận 2</option>
                {/* Add more districts */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChangeAndSubmit}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="">Chọn Phường/Xã</option>
                <option value="ward1">Phường 1</option>
                <option value="ward2">Phường 2</option>
                {/* Add more wards */}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ghi chú (không bắt buộc)
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
              placeholder="Ghi chú thêm về đơn hàng, địa chỉ giao hàng..."
            />
          </div>
        </div>
      </div>
    </form>
  );
}



