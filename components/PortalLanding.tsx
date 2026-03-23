'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Supervisor = {
  id: string;
  name: string;
  specialization: string;
};

type Assistant = {
  id: string;
  name: string;
};

type LecturerCard = {
  supervisor: Supervisor;
  assistants: Assistant[];
};

interface Props {
  facultyName: string;
}

const buildHref = (supervisorId: string, assistantId?: string | null) => {
  const params = new URLSearchParams({ supervisor_id: supervisorId });
  if (assistantId) {
    params.set('assistant_id', assistantId);
  }
  return `/submit?${params.toString()}`;
};

export default function PortalLanding({ facultyName }: Props) {
  const [cards, setCards] = useState<LecturerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lecturerEntries = cards
    .flatMap((card) => {
      const entries = [
        {
          id: `supervisor-${card.supervisor.id}`,
          name: card.supervisor.name,
          specialization: card.supervisor.specialization,
          supervisorId: card.supervisor.id,
          assistantId: null as string | null,
        },
      ];

      card.assistants.forEach((assistant) => {
        entries.push({
          id: `assistant-${assistant.id}`,
          name: assistant.name,
          specialization: card.supervisor.specialization,
          supervisorId: card.supervisor.id,
          assistantId: assistant.id,
        });
      });

      return entries;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    let active = true;

    const loadSupervisors = async () => {
      setLoading(true);
      setError(null);

      try {
        const supervisorsRes = await fetch('/api/supervisors', { cache: 'no-store' });
        if (!supervisorsRes.ok) {
          throw new Error('Failed to load supervisors.');
        }

        const supervisorsPayload = await supervisorsRes.json();
        const supervisors: Supervisor[] = supervisorsPayload.data || [];

        const lecturerCards = await Promise.all(
          supervisors.map(async (supervisor) => {
            const assistantsRes = await fetch(`/api/assistants?supervisor_id=${supervisor.id}`, {
              cache: 'no-store',
            });

            if (!assistantsRes.ok) {
              return { supervisor, assistants: [] };
            }

            const assistantsPayload = await assistantsRes.json();
            const assistants: Assistant[] = assistantsPayload.data || [];
            return { supervisor, assistants };
          })
        );

        if (active) {
          setCards(lecturerCards);
        }
      } catch (err) {
        if (active) {
          setError('Unable to load lecturers right now. Please refresh and try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSupervisors();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 portal-hero-image" aria-hidden="true" />
        <div className="absolute inset-0 portal-hero-overlay" aria-hidden="true" />
        <div className="absolute top-6 right-6 z-10">
          <Link
            href="/admin/login"
            className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Admin Login
          </Link>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center text-white">
          <div className="flex justify-center animate-fade-up">
            <Image
              src="/vertais-logo.png"
              alt="Vertais University"
              width={96}
              height={96}
              priority
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/10 p-2"
            />
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/80 animate-fade-up">
            Welcome to Veritas University
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl lg:text-6xl animate-fade-up animate-delay-100">
            Department of {facultyName}
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-white/85 max-w-2xl mx-auto animate-fade-up animate-delay-200">
            Begin your supervisor selection by reviewing the complete list of lecturers in the department.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="#lecturers"
              className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-lg font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Lecturers
            </a>
          </div>
        </div>
      </section>

      <section
        id="lecturers"
        className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-slate-900">Lecturers in {facultyName}</h2>
            <p className="text-sm text-slate-600">
              Select a lecturer to proceed to the submission form.
            </p>
          </div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            {loading ? 'Loading lecturers...' : `${lecturerEntries.length} lecturers available`}
          </p>
        </div>

        <div className="mt-8">
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-20 rounded-2xl border border-slate-200 bg-white/60 shadow-sm animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && lecturerEntries.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
              No lecturers have been added yet. Please check back soon.
            </div>
          )}

          {!loading && !error && lecturerEntries.length > 0 && (
            <ul className="space-y-4">
              {lecturerEntries.map((entry, index) => {
                const href = buildHref(entry.supervisorId, entry.assistantId);

                return (
                  <li key={entry.id} className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
                    <Link
                      href={href}
                      className="group block rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {entry.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Specialization:{' '}
                          <span className="text-slate-700 break-words">
                            {entry.specialization || 'General'}
                          </span>
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-500 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Vertais University - Department of {facultyName}</span>
          <span>2026 All rights reserved Supervisor Selection Portal</span>
        </div>
      </footer>
    </div>
  );
}
