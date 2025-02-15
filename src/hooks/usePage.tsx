import { createContext, useContext, useState, ReactNode } from 'react';

const DEFAULT_PAGE = 'LoginPage' as const;
type Page = 'MainPage' | 'LoginPage' | 'Leaderboard' | 'KubernetesLevel' | 'DockerLevel' | 'LoadingPage';

interface PageContextType {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

/**
 * Context for current page being rendered
 */
export const PageProvider = ({ children }: { children: ReactNode }) => {
    const [currentPage, setCurrentPage] = useState<Page>(DEFAULT_PAGE);

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </PageContext.Provider>
    );
};

/**
 *  Hook storing the global state for page being rendered
 * @returns usePage Hook
 */
export const usePage = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePage must be used within a PageProvider');
    }
    return context;
};

export { DEFAULT_PAGE };
export type { Page };


