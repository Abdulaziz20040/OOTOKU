import React from "react";
import { CiSearch } from "react-icons/ci";

function Blacklist() {
  return (
    <div>
      {" "}
      <div>
        {/* search */}
        <div className="relative full flex gap-2 text-[#B1B1B1] text-[16px]">
          <CiSearch className="absolute top-2 left-3 text-[20px] " />
          <input
            className=" w-full h-[35px] bg-[#F4F1F1E3] rounded-lg  ps-11 outline-none"
            placeholder="Qidirish"
          />
        </div>
        <div className="flex flex-col items-center justify-center mt-5">
          <h2 className="mt-4 text-center w-[176px] text-[#B1B1B1]">
            (ー_ー) <br />
            Qora roʻyxatingiz boʻsh.
          </h2>
          <h3 className="mt-4 mb-3 text-center w-[390px] text-[#B1B1B1]">
            Bloklangan foydalanuvchilar sizning devoringizni, faoliyatingizni,
            ro'yxatlaringizni ko'ra olmaydi, postlaringizga sharh qoldira
            olmaydi yoki sizni kuzatib bora olmaydi.
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Blacklist;
