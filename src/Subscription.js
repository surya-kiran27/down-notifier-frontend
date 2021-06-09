import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/subscription.css";

const serverurl = "http://localhost:8000";
export default function Subscription() {
  const [info, setInfo] = useState("Could not fetch data");
  const [published, setPublished] = useState("");
  const [verified, setVerified] = useState(true);
  const [email, setEmail] = useState("");
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const notifyWarning = (message) => toast.warning(message);

  useEffect(() => {
    axios
      .get(serverurl + "/status")
      .then((res) => {
        const { data } = res.data;
        setPublished(data.originTime);
        setInfo(data.status);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="grid">
      <ToastContainer position="bottom-center"></ToastContainer>
      <h1>Down Notifier</h1>
      <h2>Current Status {info}</h2>
      <h3>published at {published}</h3>

      {!verified ? (
        <div className="container-2">
          <h4>
            Please verify your email by clicking the link received in your inbox
          </h4>
          <button
            class="resend"
            onClick={async (e) => {
              e.preventDefault();
              const reqBody = {
                email,
              };
              const resendVerificationEmailRes = await axios.post(
                serverurl + "/user/resendVerificationEmail",
                reqBody
              );
              console.log(
                "resendVerificationEmailRes",
                resendVerificationEmailRes
              );
              if (resendVerificationEmailRes?.data?.success) {
                notifySuccess("Subscribed!");
              } else {
                notifyError(resendVerificationEmailRes?.data?.message);
              }
            }}
          >
            Resend verification Email
          </button>
        </div>
      ) : (
        <div className="container">
          <input
            className="email"
            type="text"
            placeholder="Enter Your Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <button
            class="subscribe"
            onClick={async (e) => {
              e.preventDefault();
              const re =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              console.log("email", email);
              if (!re.test(email.toLowerCase()))
                notifyError("Email address is not valid");
              const reqBody = {
                email,
              };
              const subscriptionRes = await axios.post(
                serverurl + "/user",
                reqBody
              );
              if (subscriptionRes?.data?.success) {
                const { data } = subscriptionRes.data;
                if (data.subscription.verified) {
                  notifySuccess("Subscribed!");
                  return;
                }
                notifyWarning("Please verify email to complete subscription");
                setVerified(false);
              } else {
                notifyError(subscriptionRes?.data?.message);
              }
              console.log("subscriptionRes", subscriptionRes);
            }}
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
}
