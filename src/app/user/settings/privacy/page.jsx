import React from "react";
import { IoCheckmarkSharp, IoChevronDownOutline } from "react-icons/io5";

function Pricacy({
  isOn,
  setIsOn,
  selectedOption,
  options,
  menuOpen,
  toggleOptionsFilter,
  selectOption,
  dropdownRef,
}) {
  return (
    <div>
      <div className="">
        <div className="flex items-center justify-between mb-2">
          Shaxsiy blog postlarini faqat obunachilarga ko’rsatish
          <div
            onClick={() => setIsOn(!isOn)}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
              isOn ? "bg-[#50D1F9]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                isOn ? "translate-x-7" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
        <hr />
        <div className="flex items-center justify-between mb-2">
          Kim devorga eslatma qoldirishi mumkin
          <div className="text-[#B1B1B1]">
            <div
              className="relative custom-select-container "
              ref={dropdownRef}
            >
              <button
                className="flex items-center gap-2 p-2 text-blackl"
                onClick={toggleOptionsFilter}
              >
                <p>{selectedOption}</p>
                <IoChevronDownOutline />
              </button>
              {menuOpen && (
                <div className="absolute top-[37px] duration-300 left-[0] p-3 w-[200px] bg-white rounded-xl shadow-md">
                  {options.map((option) => (
                    <button
                      key={option}
                      className="flex items-center justify-between text-black p-[5px] w-full text-left"
                      onClick={() => selectOption(option)}
                    >
                      {option}{" "}
                      {selectedOption === option && (
                        <IoCheckmarkSharp className=" text-[#50D1F9]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricacy;
