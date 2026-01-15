
import { useProvinces, useDistricts, useWards } from "@/hooks/useGHNLocation";
import { useForm } from "@/hooks/useForm";
import { CreateAddressRequest } from "@/services/address.service";
import { Address } from "@/types/address";

interface AddressFormProps {
  initialData?: Address | null; // For edit mode
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit: (data: CreateAddressRequest) => Promise<void>;
}

export function AddressForm({ initialData, onSuccess, onSubmit, onCancel }: AddressFormProps) {
  const isEditMode = !!initialData;

  const { 
    values, 
    handleChange, 
    setMultipleValues,
    handleSubmit: submitForm,
    isSubmitting 
  } = useForm({
    initialValues: {
      fullName: initialData?.fullName || "",
      phoneNumber: initialData?.phoneNumber || "",
      specificAddress: initialData?.specificAddress || initialData?.address || "",
      provinceId: initialData?.provinceId || "",
      districtId: initialData?.districtId || "",
      wardCode: initialData?.wardCode || "",
      isDefault: initialData?.isDefault || false,
    },
    onSubmit: async (data) => {
      console.log(isEditMode ? "🔄 Updating address:" : "🚀 Creating address:", data);
      try {
        await onSubmit(data);
        console.log(isEditMode ? "✅ Address updated successfully" : "✅ Address created successfully");
        onSuccess?.();
      } catch (error) {
        console.error(isEditMode ? "❌ Failed to update address:" : "❌ Failed to create address:", error);
      }
    },
  });

  // ✅ Sử dụng cached hooks - chỉ call API 1 lần duy nhất
  const {
    data: provinces = [],
    isLoading: provincesLoading,
    error: provincesError,
  } = useProvinces();

  const {
    data: districts = [],
    isLoading: districtsLoading,
  } = useDistricts(values.provinceId);

  const {
    data: wards = [],
    isLoading: wardsLoading,
  } = useWards(values.districtId);

  // ✅ Handler chỉ lưu ID
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    
    setMultipleValues({
      provinceId: provinceId,
      districtId: "",
      wardCode: "",
    });
  };

  // ✅ Handler chỉ lưu ID
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    
    setMultipleValues({
      districtId: districtId,
      wardCode: "",
    });
  };

  // ✅ Handler chỉ lưu Code
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = e.target.value;

    setMultipleValues({
      wardCode: wardCode,
    });
  };


  return (
    <div className="max-w-2xl mx-auto">

      {/* Error State */}
      {provincesError && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
          Không thể tải dữ liệu tỉnh/thành phố. Vui lòng thử lại sau.
        </div>
      )}

      <form onSubmit={submitForm} className="space-y-6 flex flex-col">
        {/* Province Select */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
            name="provinceId"
              value={values.provinceId}
              onChange={handleProvinceChange}
              disabled={provincesLoading}
              className="w-full p-3 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed appearance-none bg-white"
              required
            >
              <option value="">
                {provincesLoading ? "Đang tải..." : "Chọn Tỉnh/Thành phố"}
              </option>
              {provinces.map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </option>
              ))}
            </select>
            {/* Chevron Down Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {provincesLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              ⏳ Đang tải danh sách tỉnh/thành phố từ GHN...
            </p>
          )}
        </div>

        {/* District Select */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
            name="districtId"
             value={values.districtId}
              onChange={handleDistrictChange}
              disabled={!values.provinceId || districtsLoading}
              className="w-full p-3 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed appearance-none bg-white"
              required
            >
              <option value="">
                {districtsLoading
                  ? "Đang tải..."
                  : values.provinceId
                  ? "Chọn Quận/Huyện"
                  : "Vui lòng chọn Tỉnh/Thành phố trước"}
              </option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </select>
            {/* Chevron Down Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {districtsLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              ⏳ Đang tải danh sách quận/huyện...
            </p>
          )}
        </div>

        {/* Ward Select */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Phường/Xã <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
            name="wardCode"
              value={values.wardCode}
              onChange={handleWardChange}
              disabled={!values.districtId || wardsLoading}
              className="w-full p-3 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed appearance-none bg-white"
              required
            >
              <option value="">
                {wardsLoading
                  ? "Đang tải..."
                  : values.districtId
                  ? "Chọn Phường/Xã"
                  : "Vui lòng chọn Quận/Huyện trước"}
              </option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </select>
            {/* Chevron Down Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {wardsLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              ⏳ Đang tải danh sách phường/xã...
            </p>
          )}
        </div>

        {/* Address Details */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Địa chỉ cụ thể <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="specificAddress"
            value={values.specificAddress}
            onChange={handleChange}
            placeholder="Số nhà, tên đường..."
            className="bg-white w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className="bg-white w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            placeholder="0912345678"
            className="bg-white w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={values.isDefault}
            onChange={handleChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary cursor-pointer"
          />
          <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer select-none">
            Đặt làm địa chỉ mặc định
          </label>
        </div>


          <div className="flex gap-3 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary py-3 px-6 rounded-xl"
              disabled={isSubmitting}
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary py-3 px-6 rounded-xl"
            disabled={!values.wardCode || isSubmitting}
          >
            {isSubmitting 
              ? (isEditMode ? "Đang cập nhật..." : "Đang lưu...") 
              : (isEditMode ? "Cập nhật" : "Lưu địa chỉ")}
          </button>
        </div>
 
      </form>

    </div>
  );
}
