import React, { Component } from "react";
import { FcGoogle } from "react-icons/fc";

export class Accaunt extends Component {
  render() {
    return (
      <div>
        <div>
          <div className=" w-[600px]">
            <h2 className="mb-4 text-lg font-semibold">
              Ijtimoiy tarmoq orqali kiring
            </h2>

            {/* Google login input */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-[#B1B1B1]">
                Google
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 flex items-center left-3">
                  <FcGoogle />
                </span>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full p-2 pl-10 bg-gray-100 border border-[#DEDEDE] outline-none rounded-lg"
                  disabled
                />
              </div>
            </div>

            {/* Username input */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-[#B1B1B1]">
                Kirish
              </label>
              <input
                type="text"
                placeholder="John doe"
                className="w-full p-2 border border-[#DEDEDE] outline-none rounded-lg"
              />
            </div>

            {/* Save button */}
            <button className="w-full p-2 text-gray-500 bg-gray-300 rounded cursor-not-allowed">
              Saqlash
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Accaunt;
