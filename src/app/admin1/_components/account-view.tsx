"use client";

import Link from "next/link";
import adminStyles from "../../admin/admin.module.css";
import { Button, UiIcon } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { PageHead } from "./page-head";
import { useCms } from "./cms-context";

/** The signed-in person's details. They are read-only: only an administrator changes them. */
export function AccountView() {
  const { user, signOut } = useCms();

  return (
    <>
      <PageHead title="Account" lead={`Signed in as ${user.email}. Your role: ${user.roleName}.`} />

      {user.root ? (
        <div className={cms.notice} role="note">
          <UiIcon name="info" />
          <span>
            You are signed in as the administrator from the environment settings. Its name and password are changed from <Link href="/admin">/admin</Link>, under
            Account. Other people are added and changed under Users.
          </span>
        </div>
      ) : (
        <>
          <div className={cms.notice} role="note">
            <UiIcon name="info" />
            <span>Your name, email, username and password are locked. If you need to change any of them, please contact your administrator.</span>
          </div>

          <div className={cms.form} style={{ marginTop: 18 }}>
            <div className={cms.formRow}>
              <div className={adminStyles.field}>
                <label htmlFor="a-name" className={adminStyles.label}>
                  Name
                </label>
                <input id="a-name" className={adminStyles.input} value={user.name} readOnly aria-readonly="true" />
              </div>
              <div className={adminStyles.field}>
                <label htmlFor="a-email" className={adminStyles.label}>
                  Email
                </label>
                <input id="a-email" className={adminStyles.input} value={user.email} readOnly aria-readonly="true" />
              </div>
            </div>
            <div className={cms.formRow}>
              <div className={adminStyles.field}>
                <label htmlFor="a-username" className={adminStyles.label}>
                  Username
                </label>
                <input id="a-username" className={adminStyles.input} value={user.username ?? ""} placeholder="Not set" readOnly aria-readonly="true" />
              </div>
              <div className={adminStyles.field}>
                <label htmlFor="a-pass" className={adminStyles.label}>
                  Password
                </label>
                <input id="a-pass" className={adminStyles.input} value="••••••••••" readOnly aria-readonly="true" />
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: 28 }}>
        <Button icon="logout" onClick={() => void signOut()}>
          Log out
        </Button>
      </div>
    </>
  );
}
